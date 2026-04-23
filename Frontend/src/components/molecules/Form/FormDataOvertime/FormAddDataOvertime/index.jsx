import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Layout from '../../../../../layout';
import Swal from 'sweetalert2';
import { Breadcrumb, ButtonOne, ButtonTwo } from '../../../../../components';
import { createDataOvertime } from '../../../../../config/redux/action/dataOvertimeAction';
import { getMe } from '../../../../../config/redux/action';

const FormAddDataOvertime = () => {
    const [pegawaiList, setPegawaiList] = useState([]);
    const [formData, setFormData] = useState({
        pegawai_id: '',
        date_overtime: '',
        hours: '',
        reason: '',
    });

    const { pegawai_id, date_overtime, hours, reason } = formData;

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isError, user } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchPegawai = async () => {
            try {
                const response = await axios.get('http://localhost:5000/data_pegawai');
                const filteredPegawai = response.data.filter(pegawai => pegawai.hak_akses !== 'admin');
                setPegawaiList(filteredPegawai);
            } catch (error) {
                console.error("Error fetching pegawai:", error);
            }
        };
        fetchPegawai();
    }, []);

    useEffect(() => {
        dispatch(getMe());
    }, [dispatch]);

    useEffect(() => {
        if (isError) navigate('/login');
        if (user && user.hak_akses !== 'admin') navigate('/dashboard');
    }, [isError, user, navigate]);

    const submitDataOvertime = (e) => {
        e.preventDefault();

        if (!pegawai_id || !date_overtime || !hours || !reason) {
            return Swal.fire({ icon: 'error', title: 'Gagal', text: 'Semua field harus diisi!' });
        }
        
        if (reason.length < 10) {
            return Swal.fire({ icon: 'error', title: 'Gagal', text: 'Alasan harus minimal 10 karakter' });
        }
        
        const otHours = parseInt(hours);
        if (isNaN(otHours) || otHours < 1 || otHours > 6) {
            return Swal.fire({ icon: 'error', title: 'Gagal', text: 'Jam lembur harus antara 1 dan 6 jam' });
        }

        const selectedDate = new Date(date_overtime);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate > today) {
            return Swal.fire({ icon: 'error', title: 'Gagal', text: 'Tanggal tidak boleh di masa depan' });
        }

        const diffTime = Math.abs(today - selectedDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        if (diffDays > 7) {
            return Swal.fire({ icon: 'error', title: 'Gagal', text: 'Tanggal tidak boleh lebih dari 7 hari yang lalu' });
        }

        dispatch(createDataOvertime(formData, navigate))
            .then((response) => {
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: response.data?.msg || 'Data berhasil disimpan',
                    showConfirmButton: false,
                    timer: 1500,
                }).then(() => {
                    navigate('/data-lembur');
                });
            })
            .catch((error) => {
                const errorMsg = error.response?.data?.msg || error.message || 'Terjadi kesalahan';
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: errorMsg,
                    confirmButtonText: 'Ok',
                });
            });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <Layout>
            <Breadcrumb pageName='Form Data Lembur' />

            <div className='sm:grid-cols-2'>
                <div className='flex flex-col gap-9'>
                    <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
                        <div className='border-b border-stroke py-4 px-6.5 dark:border-strokedark'>
                            <h3 className='font-medium text-black dark:text-white'>
                                Form Tambah Data Lembur
                            </h3>
                        </div>
                        <form onSubmit={submitDataOvertime}>
                            <div className='p-6.5'>
                                <div className='mb-4.5'>
                                    
                                    <div className='w-full mb-4'>
                                        <label className='mb-4 block text-black dark:text-white'>
                                            Pegawai <span className='text-meta-1'>*</span>
                                        </label>
                                        <select
                                            name='pegawai_id'
                                            value={pegawai_id}
                                            onChange={handleChange}
                                            required
                                            className='relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input'
                                        >
                                            <option value='' disabled>Pilih Pegawai</option>
                                            {pegawaiList.map((pegawai) => (
                                                <option key={pegawai.id} value={pegawai.id}>
                                                    {pegawai.nama_pegawai} ({pegawai.nik})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className='w-full mb-4'>
                                        <label className='mb-4 block text-black dark:text-white'>
                                            Tanggal Lembur <span className='text-meta-1'>*</span>
                                        </label>
                                        <input
                                            type='date'
                                            name='date_overtime'
                                            value={date_overtime}
                                            onChange={handleChange}
                                            required
                                            className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                        />
                                    </div>

                                    <div className='w-full mb-4'>
                                        <label className='mb-4 block text-black dark:text-white'>
                                            Jam Lembur (1-6) <span className='text-meta-1'>*</span>
                                        </label>
                                        <input
                                            type='number'
                                            name='hours'
                                            value={hours}
                                            onChange={handleChange}
                                            required
                                            min="1"
                                            max="6"
                                            placeholder='Masukkan jumlah jam'
                                            className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                        />
                                    </div>

                                    <div className='w-full mb-4'>
                                        <label className='mb-4 block text-black dark:text-white'>
                                            Alasan <span className='text-meta-1'>*</span>
                                        </label>
                                        <textarea
                                            name='reason'
                                            value={reason}
                                            onChange={handleChange}
                                            required
                                            rows={3}
                                            placeholder='Minimal 10 karakter'
                                            className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                        />
                                    </div>

                                </div>

                                <div className='flex flex-col md:flex-row w-full gap-3 text-center'>
                                    <div>
                                        <ButtonOne>
                                            <span>Simpan</span>
                                        </ButtonOne>
                                    </div>
                                    <Link to="/data-lembur" >
                                        <ButtonTwo>
                                            <span>Kembali</span>
                                        </ButtonTwo>
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default FormAddDataOvertime;
