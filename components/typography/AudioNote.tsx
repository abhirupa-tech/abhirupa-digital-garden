type AudioNoteProps = {
  src?: string;
  label?: string;
};

/** A styled audio note. No `src` yet? Renders a quiet placeholder state. */
export function AudioNote({ src, label = 'Audio note' }: AudioNoteProps) {
  return (
    <div className="my-8 rounded-sm border border-parchment/10 bg-ink-700/30 p-4">
      <span className="label text-parchment-faint">{label}</span>
      {src ? (
        <audio controls src={src} className="mt-3 w-full accent-sand">
          Your browser does not support the audio element.
        </audio>
      ) : (
        <p className="mt-3 font-body text-sm italic text-parchment-faint/70">
          Recording coming soon.
        </p>
      )}
    </div>
  );
}
