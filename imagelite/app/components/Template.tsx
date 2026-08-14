interface TemplateProps {
    children: React.ReactNode
}

export const Template: React.FC<TemplateProps> = (props: TemplateProps) => {
    return (
        <>
            <Header />

            { props.children }

            <Footer />
        </>
    )
}
const Header: React.FC = () => {
    return(
        <header className="bg-red-900 text-white py-3">
            <div className="container mx-auto px-4 flex justify-between items-center px-4">
                <h1 className="text-3xl font-bold">ImageLite</h1>
            </div>
        </header>
    )
}
const Footer: React.FC = () => {
    return(
        <footer className="bg-red-900 text-white py-3">
            <div className="container mx-auto px-4 flex justify-between items-center px-4">
              <h1 >Developed by Arthur Henrique </h1>
            </div>
        </footer>
    )
}

