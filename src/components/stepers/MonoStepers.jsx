export const MonoStepers = ({ stepNumber, verticalLineHeight = "auto" }) => {
  return (
    <div className="mono-stepper" style={{ height: verticalLineHeight }}>
      <div className="stepper-circle">{stepNumber}</div>
      {/* <div className="vertical-line"></div> */}
    </div>
  );
};