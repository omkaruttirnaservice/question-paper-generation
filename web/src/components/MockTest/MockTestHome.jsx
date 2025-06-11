import { Link } from 'react-router-dom';
import CButton from '../UI/CButton';
import { H2, H3 } from '../UI/Headings';

function MockTestHome() {
    return (
        <>
            <H2>Mock Handler</H2>

            <div className="flex gap-3">
                <Link to={'/mock-test/create'}>
                    <CButton>Create mock exam</CButton>
                </Link>
            </div>
        </>
    );
}

export default MockTestHome;
