import { FC } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecordCard from "@/components/RecordCard";

const Home: FC = () => {
  return (
    <div className="bg-home_gradient h-screen flex w-full gap-10 items-center justify-center">
      <Tabs
        defaultValue="supply"
        className="container w-full flex flex-col gap-10 max-w-3xl"
      >
        <TabsList className="grid w-full grid-cols-2 rounded-lg">
          <TabsTrigger className="data-[state=active]:text-home_gradient data-[state=active]:font-bold" value="supply">Supply</TabsTrigger>
          <TabsTrigger className="data-[state=active]:text-home_gradient data-[state=active]:font-bold" value="borrow">Borrow</TabsTrigger>
        </TabsList>
        <TabsContent value="supply">
          <RecordCard title="Your Supplies" type="supply"  />
        </TabsContent>
        <TabsContent value="borrow">
          <RecordCard title="Your Borrows" type="borrow" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Home;
