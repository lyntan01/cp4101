import React from "react";
import logo from "../assets/codelearner-logo-no-background.png";

interface CodeLearnerLogoProps {
  className?: string;
}

export const CodeLearnerLogo: React.FC<CodeLearnerLogoProps> = ({
  className,
}) => {
  return (
    <div>
      <img className={className} src={logo} alt="CodeLearner Logo" />
    </div>
  );
};
