import Image from "next/image";

export default function ShowImage({ path }: { path: string }) {
  return (
    <>
      <label htmlFor={path} className="link link-info">
        Show
      </label>

      <input type="checkbox" id={path} className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <Image
            src={`/assets/${path}`}
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
