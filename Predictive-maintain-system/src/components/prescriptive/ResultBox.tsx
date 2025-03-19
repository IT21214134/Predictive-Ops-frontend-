type ResultBoxProps = {
  prediction: string | null;
};

export default function ResultBox({ prediction }: ResultBoxProps) {
  return (
    <div className="bg-gray-100 p-6 rounded shadow-md max-w-lg mx-auto text-center">
      <h3 className="text-xl font-semibold mb-2">Predicted Result</h3>
      <div className="bg-gray-200 p-4 rounded">
        {prediction
          ? `Target Failure Type 1: ${prediction}`
          : "[Predicted Value]"}
      </div>
    </div>
  );
}
