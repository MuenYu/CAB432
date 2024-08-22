import { IconSend } from "@tabler/icons-react";

const SettingForm = () => {
  return (
    <form className="flex flex-col items-center gap-6">
      <fieldset className="flex gap-6 flex-col lg:flex-row items-center">
        <div>
          <div
            className="tooltip"
            data-tip="You can upload a new video or select an uploaded video from the list below"
          >
            <label className="block font-medium mb-2">
              Upload/Select your video:
            </label>
          </div>
          <input
            type="file"
            accept="video/*"
            className="file-input file-input-bordered file-input-primary block"
          />
        </div>
        <div>
          <div
            className="tooltip"
            data-tip="Higher compression level, smaller file size, lower quality"
          >
            <label className="block font-medium mb-2">Compression Level:</label>
          </div>
          <input
            type="range"
            min={28}
            max={48}
            className="range range-primary"
            step={10}
          />
          <div className="flex w-full justify-between px-2 text-xs">
            <span>Low</span>
            <span>Medium</span>
            <span>High</span>
          </div>
        </div>
      </fieldset>
      <button className="btn btn-primary">
        <IconSend stroke={2} /> Squash it!
      </button>
    </form>
  );
};

export default SettingForm;