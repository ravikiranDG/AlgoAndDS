import { NextRequest, NextResponse } from "next/server";
import {
  generateJavaSource,
  executeCode,
  parseExecutionOutput,
} from "../../../lib/executor";
import type { TestRunnerConfig } from "../../../lib/executor";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userCode, runnerConfig, mode } = body as {
      userCode: string;
      runnerConfig: TestRunnerConfig;
      mode?: "run" | "generate";
    };

    if (!userCode || !runnerConfig) {
      return NextResponse.json({ error: "Missing userCode or runnerConfig" }, { status: 400 });
    }

    const javaSource = generateJavaSource(userCode, runnerConfig);

    // Generate-only mode: return Java source for local execution
    if (mode === "generate") {
      return NextResponse.json({ javaSource });
    }

    // Execute via Judge0 CE
    const { stdout, stderr, exitCode } = await executeCode(javaSource);
    const result = parseExecutionOutput(stdout, stderr, exitCode);

    // Also include the Java source so users can debug locally if needed
    return NextResponse.json({ ...result, javaSource });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        success: false,
        runtimeError: `Execution error: ${message}`,
        testResults: [],
        totalTests: 0,
        passedTests: 0,
        executionTimeMs: 0,
      },
      { status: 500 }
    );
  }
}
