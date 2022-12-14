import loaderImage from "./images/loader.svg";

export default function Loader(props) {
  return (
    <div className="loaderContainer flexContainer vertical">
      <div className="loader centered">
        <img src={loaderImage} alt="loader" />
      </div>
      {props.children && (
        <div className="loaderText centered">{props.children}</div>
      )}
    </div>
  );
}
