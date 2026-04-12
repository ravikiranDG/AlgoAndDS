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
      return NextResponse.json(
        { error: "Missing userCode or runnerConfig" },
        { status: 400 }
      );
    }

    const javaSource = generateJavaSource(userCode, runnerConfig);

    // Generate-only mode: return the Java source for local execution
    if (mode === "generate") {
      return NextResponse.json({ javaSource });
    }

    // Try remote execution
    try {
      const { stdout, stderr, exitCode } = await executeCode(javaSource);
      const result = parseExecutionOutput(stdout, stderr, exitCode);
      return NextResponse.json(result);
    } catch (execError: unknown) {
      const msg = execError instanceof Error ? execError.message : "";
      // If no endpoint configured or endpoint failed, return source for local run
      if (msg === "NO_ENDPOINT" || msg.includes("Execution service error")) {
        return NextResponse.json({
          success: false,
          noEndpoint: true,
          javaSource,
          runtimeError: "No execution service configured. Use the generated Java code to run locally.",
          testResults: [],
          totalTests: 0,
          passedTests: 0,
          executionTimeMs: 0,
        });
      }
      throw execError;
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        success: false,
        runtimeError: `Server error: ${message}`,
        testResults: [],
        totalTests: 0,
        passedTests: 0,
        executionTimeMs: 0,
      },
      { status: 500 }
    );
  }
}
