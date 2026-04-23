import DataOvertime from "../models/DataOvertimeModel.js";
import DataPegawai from "../models/DataPegawaiModel.js";
import moment from "moment";
import { Op } from "sequelize";

export const viewDataOvertime = async (req, res) => {
    try {
        const dataOvertime = await DataOvertime.findAll({
            order: [['date_overtime', 'DESC']]
        });
        res.json(dataOvertime);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const viewDataOvertimeByID = async (req, res) => {
    try {
        const dataOvertime = await DataOvertime.findOne({
            where: { id: req.params.id }
        });
        res.json(dataOvertime);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const createDataOvertime = async (req, res) => {
    const { pegawai_id, date_overtime, hours, reason } = req.body;

    if (!pegawai_id || !date_overtime || !hours || !reason) {
        return res.status(400).json({ msg: "Semua field harus diisi" });
    }

    if (reason.length < 10) {
        return res.status(400).json({ msg: "Alasan harus minimal 10 karakter" });
    }

    const overtimeHours = parseInt(hours);
    if (isNaN(overtimeHours) || overtimeHours < 1 || overtimeHours > 6) {
        return res.status(400).json({ msg: "Jam lembur harus antara 1 dan 6 jam" });
    }

    const selectedDate = moment(date_overtime, "YYYY-MM-DD");
    const today = moment().startOf('day');
    
    if (!selectedDate.isValid()) {
        return res.status(400).json({ msg: "Format tanggal tidak valid" });
    }

    if (selectedDate.isAfter(today)) {
        return res.status(400).json({ msg: "Tanggal tidak boleh di masa depan" });
    }

    if (today.diff(selectedDate, 'days') > 7) {
        return res.status(400).json({ msg: "Tanggal tidak boleh lebih dari 7 hari yang lalu" });
    }

    try {
        const pegawai = await DataPegawai.findOne({
            where: { id: pegawai_id }
        });

        if (!pegawai) {
            return res.status(404).json({ msg: "Pegawai tidak ditemukan" });
        }

        const existingEntry = await DataOvertime.findOne({
            where: {
                pegawai_id: pegawai_id,
                date_overtime: date_overtime
            }
        });

        if (existingEntry) {
            return res.status(400).json({ msg: "Data lembur untuk pegawai ini pada tanggal tersebut sudah ada" });
        }

        const startOfMonth = selectedDate.clone().startOf('month').format('YYYY-MM-DD');
        const endOfMonth = selectedDate.clone().endOf('month').format('YYYY-MM-DD');

        const monthlyOvertimes = await DataOvertime.findAll({
            where: {
                pegawai_id: pegawai_id,
                date_overtime: {
                    [Op.between]: [startOfMonth, endOfMonth]
                }
            }
        });

        const currentMonthlyTotal = monthlyOvertimes.reduce((total, ot) => total + ot.hours, 0);

        if (currentMonthlyTotal + overtimeHours > 60) {
            return res.status(400).json({ 
                msg: `Total lembur bulan ini akan melebihi 60 jam. Total saat ini: ${currentMonthlyTotal} jam` 
            });
        }

        await DataOvertime.create({
            pegawai_id: pegawai.id,
            nama_pegawai: pegawai.nama_pegawai,
            date_overtime: date_overtime,
            hours: overtimeHours,
            reason: reason
        });

        res.status(201).json({ msg: "Data lembur berhasil ditambahkan" });

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const deleteDataOvertime = async (req, res) => {
    try {
        const dataOvertime = await DataOvertime.findOne({
            where: { id: req.params.id }
        });

        if(!dataOvertime) return res.status(404).json({ msg: "Data lembur tidak ditemukan" });

        await DataOvertime.destroy({
            where: { id: dataOvertime.id }
        });

        res.status(200).json({ msg: "Data lembur berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
