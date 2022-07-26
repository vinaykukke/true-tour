export const SceneTooltip = ({ title = "Test", message = "Test Message" }) => (
  <>
    {title && <p>{title}</p>}
    {message && <p>{message}</p>}
  </>
);

export const DefaultTooltip = () => <div>Default Tooltip</div>;
