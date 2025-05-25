import { NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";
import * as csv from "csv-parse/sync";

export async function GET() {
  const csvFilePath = path.join(process.cwd(), "public", "dataset.csv");
  const fileContent = fs.readFileSync(csvFilePath, "utf-8");

  const records = csv.parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  });

  const data = records.map((record: any) => ({
    vibration_1: Number(record.Vibration_01),
    vibration_2: Number(record.Vibration_02),
    vibration_3: Number(record.Vibration_03),
    temperature: Number(record.Temperature_01),
    rpm_1: Number(record.RPM_Sensor_01),
    Target: Number(record.Target),
    Failure_Flag: getFailureFlag(record.Failure_Type_Encoded),
    Failure_Type_Name: record.Failure_Type_Encoded,
  }));

  return NextResponse.json({ data });
}

function getFailureFlag(failureType: string): number {
  switch (failureType) {
    case "Trimmer Bearing Fault":
      return 1;
    case "Drill Issue":
      return 2;
    case "No Failure":
      return 3;
    default:
      return 3;
  }
}
