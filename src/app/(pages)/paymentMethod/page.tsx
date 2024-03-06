import MainLayout from "@/app/components/mainLayout";
import Link from "next/link";
import { FaPlusCircle } from "react-icons/fa";

export default async function PaymentMethod() {
  return (
    <MainLayout>
      <title>Depositor - Payment Method</title>
      <Link href={"/addNewPaymentMethod"} className="btn btn-success">
        <FaPlusCircle size={20} />
        <span>Add New Payment</span>
      </Link>
    </MainLayout>
  );
}
