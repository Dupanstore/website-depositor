import axios from "axios";
import Image from "next/image";

export default async function ShowImage({ path }: { path: string }) {
  async function getImage() {
    try {
      const { data } = await axios.post(`http://localhost:3000/api/getimage/`, {
        img: path,
      });
      return data;
    } catch (error) {
      return error;
    }
  }
  const { dataUrl } = await getImage();

  return (
    <>
      <label htmlFor={path} className="link link-info">
        Show
      </label>

      <input type="checkbox" id={path} className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <Image
            src={dataUrl ? dataUrl : "/assets/default.webp"}
            width={500}
            height={500}
            alt="Bukti Transfer"
            className="w-full rounded-lg"
          />
        </div>
        <label className="modal-backdrop cursor-pointer" htmlFor={path}></label>
      </div>
    </>
  );
}
