import Link from 'next/link';

const NavLink = ({ href, label }) => (
    <li className="inline-block">
        <Link href={href}>
            <a className="font-bold text-lg p-2 hover:text-red-800">{label}</a>
        </Link>
    </li>
)

const NavBar = () => (
    <nav className="bg-gray-500 py-4 text-center ">
        <ul>
            <NavLink href='/' label="Home" />
            <NavLink href='/sobre' label="Sobre" />
            <NavLink href='/cadastro' label="Cadastre-se" />
            <NavLink href='/entrar' label="Entrar" />
        </ul>
    </nav>
);

export default NavBar;

