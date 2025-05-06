import React from 'react';
import { Layout } from 'antd';
import { Link } from 'react-router-dom';
const { Footer } = Layout;

type FooterNavProps = React.HTMLAttributes<HTMLDivElement>;

const FooterNav: React.FC<FooterNavProps> = React.memo(({ ...others }) => {
  return (
    <Footer {...others}>
      CPM Dashboard © 2025 Created by <Link to={'https://magicallysoft.com/'} target='_blanck'>MagicallySoft</Link>
    </Footer>
  );
});

export default React.memo(FooterNav);
