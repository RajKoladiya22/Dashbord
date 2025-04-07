import { Layout } from 'antd';

const { Footer } = Layout;

type FooterNavProps = React.HTMLAttributes<HTMLDivElement>;

const FooterNav = ({ ...others }: FooterNavProps) => {
  return (
    <Footer {...others}>CPM Dashboard © 2025 Created by MagicallySoft</Footer>
  );
};

export default FooterNav;
