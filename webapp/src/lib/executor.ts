// Code execution provider abstraction using Piston API
const PISTON_URL = "https://emkc.org/api/v2/piston/execute";

export interface ExecutionResult {
  success: boolean;
  compilationError?: string;
  runtimeError?: string;
  timeout?: boolean;
  testResults: TestResult[];
  totalTests: number;
  passedTests: number;
  executionTimeMs: number;
  rawOutput?: string;
}

export interface TestResult {
  id: number;
  name: string;
  passed: boolean;
  input: string;
  expected: string;
  actual: string;
  error?: string;
}

export interface TestRunnerConfig {
  className: string;
  methodName: string;
  returnType: string;
  tests: {
    name: string;
    inputDisplay: string;
    args: string;       // Java expression for method arguments
    expected: string;   // Java expression for expected value
    expectedDisplay: string; // Human-readable expected output
  }[];
  helperClasses?: string; // ListNode, TreeNode definitions, etc.
  sortBeforeCompare?: boolean;
  customCompare?: string;
  expectedComplexity?: { time: string; space: string };
}

function getCompareCode(returnType: string, sortBefore?: boolean): string {
  const sortCode = sortBefore ? "java.util.Arrays.sort(__actual); java.util.Arrays.sort(__expected);" : "";
  switch (returnType) {
    case "int":
    case "long":
    case "char":
      return `${sortCode} __match = (__actual == __expected);`;
    case "double":
    case "float":
      return `${sortCode} __match = (Math.abs(__actual - __expected) < 1e-5);`;
    case "boolean":
      return `${sortCode} __match = (__actual == __expected);`;
    case "String":
      return `${sortCode} __match = java.util.Objects.equals(__actual, __expected);`;
    case "int[]":
      return `${sortCode} __match = java.util.Arrays.equals(__actual, __expected); __actualStr = java.util.Arrays.toString(__actual); __expectedStr = java.util.Arrays.toString(__expected);`;
    case "int[][]":
      return `${sortCode} __match = java.util.Arrays.deepEquals(__actual, __expected); __actualStr = java.util.Arrays.deepToString(__actual); __expectedStr = java.util.Arrays.deepToString(__expected);`;
    case "List<Integer>":
    case "List<String>":
    case "List<List<Integer>>":
    case "List<List<String>>":
      return `${sortCode} __match = java.util.Objects.equals(__actual, __expected);`;
    default:
      return `${sortCode} __match = java.util.Objects.equals(__actual, __expected);`;
  }
}

function toStringExpr(returnType: string, varName: string): string {
  switch (returnType) {
    case "int[]":
      return `java.util.Arrays.toString(${varName})`;
    case "int[][]":
      return `java.util.Arrays.deepToString(${varName})`;
    case "double":
    case "float":
      return `String.format("%.5f", ${varName})`;
    default:
      return `String.valueOf(${varName})`;
  }
}

export function generateJavaSource(userCode: string, config: TestRunnerConfig): string {
  // Strip 'public' from user's class declaration to avoid conflict
  let cleanedCode = userCode.replace(/public\s+class\s+/g, "class ");
  // Also handle case where user includes imports - extract them
  const importRegex = /^(import\s+[^;]+;\s*)+/m;
  const importMatch = cleanedCode.match(importRegex);
  let imports = "";
  if (importMatch) {
    imports = importMatch[0];
    cleanedCode = cleanedCode.replace(importRegex, "");
  }

  const tests = config.tests;
  const needsArrayStr = ["int[]", "int[][]"].includes(config.returnType);
  const toStr = (v: string) => toStringExpr(config.returnType, v);

  let testCode = "";
  for (let i = 0; i < tests.length; i++) {
    const t = tests[i];
    testCode += `
        // Test ${i + 1}: ${t.name}
        __tests++;
        try {
            ${config.returnType} __actual = sol.${config.methodName}(${t.args});
            ${config.returnType} __expected = ${t.expected};
            boolean __match = false;
            String __actualStr = ${toStr("__actual")};
            String __expectedStr = ${toStr("__expected")};
            ${getCompareCode(config.returnType, config.sortBeforeCompare)}
            if (__match) {
                __passed++;
                System.out.println("PASS|${t.name}|" + __actualStr);
            } else {
                System.out.println("FAIL|${t.name}|" + __expectedStr + "|" + __actualStr);
            }
        } catch (Exception __e) {
            System.out.println("ERROR|${t.name}|" + __e.getClass().getSimpleName() + ": " + __e.getMessage());
        }
`;
  }

  return `import java.util.*;
import java.util.stream.*;
${imports}

${config.helperClasses || ""}

${cleanedCode}

public class Main {
    public static void main(String[] args) {
        ${config.className} sol = new ${config.className}();
        int __tests = 0, __passed = 0;
        long __start = System.nanoTime();
${testCode}
        long __elapsed = System.nanoTime() - __start;
        System.out.println("SUMMARY|" + __passed + "|" + __tests + "|" + (__elapsed / 1000000));
    }
}
`;
}

export function parseExecutionOutput(stdout: string, stderr: string, exitCode: number): ExecutionResult {
  const startTime = Date.now();

  // Check for compilation errors
  if (stderr && (stderr.includes("error:") || stderr.includes("Error:"))) {
    return {
      success: false,
      compilationError: stderr.trim(),
      testResults: [],
      totalTests: 0,
      passedTests: 0,
      executionTimeMs: 0,
    };
  }

  const lines = stdout.split("\n").filter((l) => l.trim());
  const testResults: TestResult[] = [];
  let totalTests = 0;
  let passedTests = 0;
  let executionTimeMs = 0;

  for (const line of lines) {
    const parts = line.split("|");
    if (parts[0] === "PASS") {
      totalTests++;
      passedTests++;
      testResults.push({
        id: totalTests,
        name: parts[1] || `Test ${totalTests}`,
        passed: true,
        input: "",
        expected: parts[2] || "",
        actual: parts[2] || "",
      });
    } else if (parts[0] === "FAIL") {
      totalTests++;
      testResults.push({
        id: totalTests,
        name: parts[1] || `Test ${totalTests}`,
        passed: false,
        input: "",
        expected: parts[2] || "",
        actual: parts[3] || "",
      });
    } else if (parts[0] === "ERROR") {
      totalTests++;
      testResults.push({
        id: totalTests,
        name: parts[1] || `Test ${totalTests}`,
        passed: false,
        input: "",
        expected: "",
        actual: "",
        error: parts[2] || "Runtime error",
      });
    } else if (parts[0] === "SUMMARY") {
      passedTests = parseInt(parts[1]) || 0;
      totalTests = parseInt(parts[2]) || totalTests;
      executionTimeMs = parseInt(parts[3]) || 0;
    }
  }

  // Check for timeout
  if (exitCode !== 0 && !stderr && testResults.length === 0) {
    return {
      success: false,
      timeout: true,
      testResults: [],
      totalTests: 0,
      passedTests: 0,
      executionTimeMs: 0,
      runtimeError: "Execution timed out (possible infinite loop)",
    };
  }

  // Runtime error without test output
  if (stderr && testResults.length === 0) {
    return {
      success: false,
      runtimeError: stderr.trim(),
      testResults: [],
      totalTests: 0,
      passedTests: 0,
      executionTimeMs: 0,
    };
  }

  return {
    success: passedTests === totalTests && totalTests > 0,
    testResults,
    totalTests,
    passedTests,
    executionTimeMs,
    rawOutput: stdout,
    runtimeError: stderr ? stderr.trim() : undefined,
  };
}

export async function executeCode(
  javaSource: string
): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  const response = await fetch(PISTON_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      language: "java",
      version: "15.0.2",
      files: [{ name: "Main.java", content: javaSource }],
      compile_timeout: 10000,
      run_timeout: 10000,
      compile_memory_limit: -1,
      run_memory_limit: -1,
    }),
  });

  if (!response.ok) {
    throw new Error(`Execution service error: ${response.status}`);
  }

  const data = await response.json();

  // Check for compile errors
  if (data.compile && data.compile.code !== 0) {
    return {
      stdout: "",
      stderr: data.compile.stderr || data.compile.output || "Compilation failed",
      exitCode: data.compile.code,
    };
  }

  return {
    stdout: data.run?.stdout || "",
    stderr: data.run?.stderr || "",
    exitCode: data.run?.code || 0,
  };
}
