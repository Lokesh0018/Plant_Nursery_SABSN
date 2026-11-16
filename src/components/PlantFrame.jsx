// A sheet is downloaded once by the browser; every card selects its own cell.
export default function PlantFrame({ plant }) {
  const { sheet, cell = 0, columns = 3, rows = 3 } = plant;
  const ratio = plant.imagePresentation?.cellAspectRatio || 1;
  return <div className="plant-frame" role="img" aria-label={`${plant.name}, ${plant.imagePresentation?.label || 'illustrative full plant'}`}>
    <div className="plant-frame-cell" style={{ aspectRatio: ratio }}>
      <img src={sheet} alt="" loading="lazy" decoding="async" style={{ width: `${columns * 100}%`, height: 'auto', maxWidth: 'none', transform: `translate(-${(cell % columns) * 100 / columns}%, -${Math.floor(cell / columns) * 100 / rows}%)` }} />
    </div>
  </div>;
}
