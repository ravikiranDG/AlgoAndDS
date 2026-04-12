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
    const { userCode, runnerConfig } = body as {
      userCode: string;
      runnerConfig: TestRunnerConfig;
    };

    if (!userCode || !runnerConfig) {
      return NextResponse.json(
        { error: "Missing userCode or runnerConfig" },
        { status: 400 }
      );
    }

    const javaSource = generateJavaSource(userCode, runnerConfig);
    const { stdout, stderr, exitCode } = await executeCode(javaSource);
    const result = parseExecutionOutput(stdout, stderr, exitCode);

    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        success: false,
        runtimeError: `Execution service unavailable: ${message}`,
        testResults: [],
        totalTests: 0,
        passedTests: 0,
        executionTimeMs: 0,
      },
      { status: 500 }
    );
  }
}
