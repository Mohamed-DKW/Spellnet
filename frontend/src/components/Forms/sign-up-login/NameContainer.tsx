interface NameContainerProps {
    name: string
}
const NameContainer = ({name}: NameContainerProps) => {
    return (
        <>
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-amber-100 mb-1">{name}</h1>
                <div className="w-24 h-0.5 bg-amber-600 mx-auto mt-2" />
            </div>
        </>
    )
}
export default NameContainer