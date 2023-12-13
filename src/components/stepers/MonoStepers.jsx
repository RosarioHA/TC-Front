
export const MonoStepers = ({ stepNumber }) => {

  return (
    <div className="mono-stepper">
      <div className="stepper-circle">{stepNumber}</div>
      <div className="vertical-line"></div>
    </div>
  );
};