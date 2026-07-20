// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title HKIRegistry
/// @notice Kontrak sederhana untuk mendaftarkan dan membaca data Hak Kekayaan Intelektual (HKI)
contract HKIRegistry {
    struct HKI {
        uint256 id;
        string namaPemilik;
        string judulHKI;
        string jenisHKI;
        string email;
        string noTelepon;
        string uraianSingkat;
        uint256 tanggalPendaftaran;
        address walletPendaftar;
    }

    uint256 private nextId = 1;
    mapping(uint256 => HKI) private hkiData;

    event HKIRegistered(
        uint256 indexed id,
        address indexed walletPendaftar,
        string judulHKI,
        string jenisHKI,
        uint256 tanggalPendaftaran
    );

    function registerHKI(
        string memory _namaPemilik,
        string memory _judulHKI,
        string memory _jenisHKI,
        string memory _email,
        string memory _noTelepon,
        string memory _uraianSingkat
    ) public returns (uint256 id) {
        require(bytes(_namaPemilik).length > 0, "Nama pemilik tidak boleh kosong");
        require(bytes(_judulHKI).length > 0, "Judul HKI tidak boleh kosong");
        require(bytes(_jenisHKI).length > 0, "Jenis HKI tidak boleh kosong");
        require(bytes(_email).length > 0, "Email tidak boleh kosong");
        require(bytes(_noTelepon).length > 0, "Nomor telepon tidak boleh kosong");

        id = nextId;
        hkiData[id] = HKI({
            id: id,
            namaPemilik: _namaPemilik,
            judulHKI: _judulHKI,
            jenisHKI: _jenisHKI,
            email: _email,
            noTelepon: _noTelepon,
            uraianSingkat: _uraianSingkat,
            tanggalPendaftaran: block.timestamp,
            walletPendaftar: msg.sender
        });

        emit HKIRegistered(id, msg.sender, _judulHKI, _jenisHKI, block.timestamp);
        nextId++;
    }

    function getHKI(uint256 _id)
        public
        view
        returns (
            uint256 id,
            string memory namaPemilik,
            string memory judulHKI,
            string memory jenisHKI,
            string memory email,
            string memory noTelepon,
            string memory uraianSingkat,
            uint256 tanggalPendaftaran,
            address walletPendaftar
        )
    {
        require(_id > 0 && _id < nextId, "ID HKI tidak ditemukan");
        HKI memory h = hkiData[_id];
        return (
            h.id,
            h.namaPemilik,
            h.judulHKI,
            h.jenisHKI,
            h.email,
            h.noTelepon,
            h.uraianSingkat,
            h.tanggalPendaftaran,
            h.walletPendaftar
        );
    }

    function getTotalHKI() public view returns (uint256) {
        return nextId - 1;
    }
}
