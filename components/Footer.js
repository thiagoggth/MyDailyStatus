const SocialLink = ({ href, label }) => (
    <a
        href={href}
        target="_blank"
        className="ml-1 px-2 py-1 bg-gray-800  rounded-md text-red-700"
    >
        {label}
    </a>
)

const Footer = () => (
    <footer className="py-4 text-center bg-gray-900 text-white">
        <p>MyDailyStatus é um projeto criado durante o Fullstack lab do DevPleno.</p>
        <p className="mt-3">Implementado por: Thiago Augusto
            <SocialLink href="https://www.linkedin.com/in/thiagoggth/" label="Linkedin" />
            <SocialLink href="https://github.com/thiagoggth" label="GitHub" />
        </p>
        <p className="mt-3">Link do projeto no git:
            <SocialLink href="https://github.com/thiagoggth" label="MyDailyStatus" />
        </p>

    </footer>
)

export default Footer;