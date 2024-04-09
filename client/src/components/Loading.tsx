import React from "react";
import { ThreeCircles } from "react-loader-spinner";

type LoadingProps = {
  loading: boolean;
};

const Loading: React.FC<LoadingProps> = ({ loading }) => {
  if (loading)
    return (
      <div className="w-full flex items-center justify-center">
        <ThreeCircles
          visible={true}
          height="100"
          width="100"
          color="#0085FF"
          ariaLabel="three-circles-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );

  return null;
};

export default Loading;
