import { useNavigate } from "react-router-dom";
import { useWalkthroughStore } from "@/store/walkthroughStore";
import { trainingSteps } from "@/walkthrough/steps";
import ChefLogo from "@/assets/chef.svg";

const TrainingPage = () => {
  const navigate = useNavigate();
  const completedTrainings = useWalkthroughStore((s) => s.completedTrainings);

  const startWalkthrough = () => {
    // Navigate to dashboard, then start the walkthrough
    navigate("/");
    setTimeout(() => {
      useWalkthroughStore.getState().startTraining('order', trainingSteps);
    }, 100); // slight delay to ensure navigation
  };

  return (
    <div className="w-full p-4 lg:p-8 ">
      <h1 className="text-3xl font-bold">Employee Training </h1>
      <div className="flex h-[70vh] items-center justify-center">
      <div className="relative flex flex-col items-end">
        {
          completedTrainings?.profile ? (
            <div className="training-tooltip bg-green-200 text-green-800 p-4 mb-82 rounded-xl border-t-0 rounded-br-none relative z-20">
              Training completed
            </div>
          ) : (
            <button
              className="training-tooltip bg-primary-gradient-light p-4 mb-82 rounded-xl border-t-0 rounded-br-none relative z-20"
              onClick={startWalkthrough}
            >
              Tap here!
              <br /> Lets Start the Training
            </button>
          )
        }
      </div>
      <img src={ChefLogo} alt="Chef-logo" />
      </div>
    </div>
  );
};

export default TrainingPage;
