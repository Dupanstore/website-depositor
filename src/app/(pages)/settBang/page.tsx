 import MainLayout from "@/app/components/mainLayout";
 import Bang from "./bang";



export default async function settBang() {
     return (
      <MainLayout>
           <title>HeGame - Aviator</title>
     <Bang session={0} >
        </Bang>
      </MainLayout>
    );
  }
 