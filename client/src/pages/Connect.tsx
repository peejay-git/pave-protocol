import { Card, CardContent } from "@/components/ui/card";
import { FC } from "react";

const Connect: FC = () => {
  return (
    <div className="bg-home_gradient h-[calc(100vh-77px)] flex w-full  items-center justify-center ">
      <Card>
        <CardContent className=" bg-white rounded-lg hover:bg-white w-[300px] h-[300px] shadow-xl md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] shadow-white  flex items-center justify-center">
          <w3m-button />
        </CardContent>
      </Card>
    </div>
  );
};

export default Connect;
