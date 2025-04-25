import React, { useContext, useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import DoctorCard from './DoctorCard'

const TopDoctors = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [filters, setFilters] = useState({
        sortBy: searchParams.get('sortBy') || '',
        specialities: searchParams.getAll('specialities') || [],
        consultationType: searchParams.get('consultationType') || 'all',
        search: searchParams.get('search') || ''
    });

    // Fetch doctors from API
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await fetch('https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json');
                const data = await response.json();
                setDoctors(data);
                applyFilters(data);
            } catch (error) {
                console.error('Error fetching doctors:', error);
            }
        };
        fetchDoctors();
    }, []);

    // Apply filters whenever filters change
    useEffect(() => {
        applyFilters(doctors);
        updateSearchParams();
    }, [filters]);

    const updateSearchParams = () => {
        const params = new URLSearchParams();
        if (filters.sortBy) params.set('sortBy', filters.sortBy);
        if (filters.consultationType) params.set('consultationType', filters.consultationType);
        if (filters.search) params.set('search', filters.search);
        filters.specialities.forEach(spec => params.append('specialities', spec));
        setSearchParams(params);
    };

    const applyFilters = (doctorsList) => {
        let filtered = [...doctorsList];

        // Apply search filter
        if (filters.search) {
            filtered = filtered.filter(doctor => 
                doctor.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                doctor.speciality.some(s => s.toLowerCase().includes(filters.search.toLowerCase()))
            );
        }

        // Apply speciality filter
        if (filters.specialities.length > 0) {
            filtered = filtered.filter(doctor =>
                doctor.speciality.some(s => filters.specialities.includes(s))
            );
        }

        // Apply consultation type filter
        if (filters.consultationType !== 'all') {
            filtered = filtered.filter(doctor =>
                doctor.consultationType.includes(filters.consultationType)
            );
        }

        // Apply sorting
        if (filters.sortBy === 'price-low-high') {
            filtered.sort((a, b) => a.fees - b.fees);
        } else if (filters.sortBy === 'experience') {
            filtered.sort((a, b) => b.experience - a.experience);
        }

        setFilteredDoctors(filtered);
    };

    return (
        <div className='flex flex-col md:flex-row gap-6 my-16 text-gray-900 md:mx-10'>
            {/* Filters Section */}
            <div className='md:w-1/4 p-4 bg-white rounded-lg shadow-sm'>
                <div className='mb-6'>
                    <h2 className='text-xl font-medium mb-4'>Sort by</h2>
                    <div className='space-y-2'>
                        <label className='flex items-center'>
                            <input
                                type="radio"
                                name="sortBy"
                                value="price-low-high"
                                checked={filters.sortBy === 'price-low-high'}
                                onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                                className="mr-2"
                            />
                            Price: Low-High
                        </label>
                        <label className='flex items-center'>
                            <input
                                type="radio"
                                name="sortBy"
                                value="experience"
                                checked={filters.sortBy === 'experience'}
                                onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                                className="mr-2"
                            />
                            Experience: Most Experience first
                        </label>
                    </div>
                </div>

                {/* Specialities Filter */}
                <div className='mb-6'>
                    <h2 className='text-xl font-medium mb-4'>Specialities</h2>
                    <div className='space-y-2'>
                        {['General Physician', 'Cardiologist', 'Neurologist', 'Oncologist'].map(spec => (
                            <label key={spec} className='flex items-center'>
                                <input
                                    type="checkbox"
                                    checked={filters.specialities.includes(spec)}
                                    onChange={(e) => {
                                        const newSpecialities = e.target.checked 
                                            ? [...filters.specialities, spec]
                                            : filters.specialities.filter(s => s !== spec);
                                        setFilters({...filters, specialities: newSpecialities});
                                    }}
                                    className="mr-2"
                                />
                                {spec}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Mode of Consultation */}
                <div className='mb-6'>
                    <h2 className='text-xl font-medium mb-4'>Mode of consultation</h2>
                    <div className='space-y-2'>
                        {['video', 'in-clinic', 'all'].map(type => (
                            <label key={type} className='flex items-center'>
                                <input
                                    type="radio"
                                    name="consultationType"
                                    value={type}
                                    checked={filters.consultationType === type}
                                    onChange={(e) => setFilters({...filters, consultationType: e.target.value})}
                                    className="mr-2"
                                />
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Doctors List Section */}
            <div className='md:w-3/4'>
                <div className='mb-4'>
                    <input
                        type="text"
                        placeholder="Search doctors..."
                        value={filters.search}
                        onChange={(e) => setFilters({...filters, search: e.target.value})}
                        className='w-full p-2 border rounded'
                    />
                </div>
                <div className='grid grid-cols-1 gap-4'>
                    {filteredDoctors.map((doctor, index) => (
                        <DoctorCard key={doctor._id || index} doctor={doctor} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TopDoctors;