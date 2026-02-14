import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import lockAnimUrl from "../assets/animations/lock.lottie?url";

const AddPasswordButton = () => {
  return (
    <button className="flex text-center items-center gap-2 rounded-full bg-green-500 px-4 py-2 text-white">
      <DotLottieReact
        src={lockAnimUrl}
        autoplay
        loop
        style={{ width: 22, height: 22 }}
      />
      <span>Add Password</span>
    </button>
  );
};

export default AddPasswordButton;