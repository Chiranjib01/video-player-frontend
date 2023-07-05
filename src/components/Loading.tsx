import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface LoadingProps {
  height: string;
  width: string;
  className?: string;
}

const Loading = ({
  height = "30px",
  width = "30px",
  className = "",
}: LoadingProps) => {
  return (
    <div className={className}>
      <AiOutlineLoading3Quarters
        className={`circularLoader`}
        style={{ height, width }}
      />
    </div>
  );
};

export default Loading;
