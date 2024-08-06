import React from "react";
import ProgressBar from "@ramonak/react-progress-bar";


export default function LineProgressBar({ completed, total ,color}) {
  if (!completed || !total) {
    return null; 
  }

  
  const progressInSeconds = (completed * 3600) 

  const progressPercentage = (progressInSeconds / (total * 3600)) * 100;

  return (
    <div className="progress-bar-container">
      <ProgressBar
        completed={progressPercentage}
        bgColor={color}
        animateOnRender={true}
        isLabelVisible={false}
        height="10px"
      />
    </div>
  );
}