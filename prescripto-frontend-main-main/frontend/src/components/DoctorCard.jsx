import React from 'react';
import { useNavigate } from 'react-router-dom';

const DoctorCard = ({ doctor }) => {
    const navigate = useNavigate();

    return (
        <div 
            onClick={() => {
                navigate(`/appointment/${doctor._id}`);
                window.scrollTo(0, 0);
            }}
            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        >
            <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
                    {doctor.image ? (
                        <img
                            src={doctor.image}
                            alt={doctor.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-semibold">
                            {doctor.name[0]}
                        </div>
                    )}
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                    <p className="text-sm text-gray-600">{doctor.speciality}</p>
                    <p className="text-sm text-gray-600">{doctor.qualification}</p>
                    <div className="mt-2">
                        <div className="flex items-center gap-2 text-sm text-green-500">
                            <p className="w-2 h-2 bg-green-500 rounded-full"></p>
                            <p>Available</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorCard;