import AddDivisionModal from "@/components/modules/Authentication/Admin/Division/AddDivisionModal";

const AddDivision = () => {
    return (
        <div>
            <div className="flex justify-between my-8">
                <h1 className="text-xl font-semibold">Tour Division </h1>
                <AddDivisionModal />
            </div>
        </div>
    );
};

export default AddDivision;
