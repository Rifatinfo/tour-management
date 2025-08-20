import { useGetTourTypeQuery } from "@/redux/Tour/tour.api";

const AddTourType = () => {
    const {data} = useGetTourTypeQuery(undefined);
    console.log(data);
    
    return (
        <div>
            <p>AddTourType</p>
        </div>
    );
};

export default AddTourType;