import { Link } from "react-router";

const Unauthorized = () => {
    return (
        <div>
            <p>You Are Unauthorized</p>
            <Link to="/">Home</Link>
        </div>
    );
};

export default Unauthorized;