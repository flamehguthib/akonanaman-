import logo from '../assets/logo.jpg';


export default function Logo({ size = 40, textSize = 'text-2xl', color = 'text-indigo-950' }) {
  return (
    <div className="flex flex-row items-center gap-x-2">
      <svg width={size} height={size} viewBox="0 0 40 40">
        <image
          className="origin-center"
          href={logo}
          width="40" 
          height="40"
          preserveAspectRatio="xMidYMid slice"
        />
      </svg>
      <h2 className={`font-bold ${textSize} ${color}`}>PARTimed</h2>
    </div>
  )
}