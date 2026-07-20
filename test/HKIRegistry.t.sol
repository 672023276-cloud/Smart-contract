// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/HKIRegistry.sol";

contract HKIRegistryTest is Test {
    HKIRegistry public hki;

    function setUp() public {
        hki = new HKIRegistry();
    }

    function test_RegisterHKI() public {
        uint256 id = hki.registerHKI(
            "Budi Santoso",
            "Aplikasi Pemantau Cuaca",
            "Hak Cipta",
            "budi@email.com",
            "081234567890",
            "Aplikasi mobile untuk memantau cuaca secara real-time"
        );
        assertEq(id, 1);
        assertEq(hki.getTotalHKI(), 1);
    }

    function test_GetHKI() public {
        hki.registerHKI(
            "Andi Wijaya",
            "Metode Enkripsi Ringan",
            "Paten",
            "andi@email.com",
            "081298765432",
            "Metode enkripsi data untuk perangkat IoT berdaya rendah"
        );

        (
            uint256 id,
            string memory namaPemilik,
            string memory judulHKI,
            string memory jenisHKI,
            string memory email,
            string memory noTelepon,
            string memory uraianSingkat,
            uint256 tanggalPendaftaran,
            address walletPendaftar
        ) = hki.getHKI(1);

        assertEq(id, 1);
        assertEq(namaPemilik, "Andi Wijaya");
        assertEq(judulHKI, "Metode Enkripsi Ringan");
        assertEq(jenisHKI, "Paten");
        assertEq(email, "andi@email.com");
        assertEq(noTelepon, "081298765432");
        assertEq(uraianSingkat, "Metode enkripsi data untuk perangkat IoT berdaya rendah");
        assertEq(walletPendaftar, address(this));
        assertGt(tanggalPendaftaran, 0);
    }

    function test_RevertWhenEmailKosong() public {
        vm.expectRevert("Email tidak boleh kosong");
        hki.registerHKI("Budi Santoso", "Judul", "Hak Cipta", "", "081234567890", "Uraian");
    }

    function test_RevertWhenNoTeleponKosong() public {
        vm.expectRevert("Nomor telepon tidak boleh kosong");
        hki.registerHKI("Budi Santoso", "Judul", "Hak Cipta", "budi@email.com", "", "Uraian");
    }

    function test_RevertWhenIDTidakDitemukan() public {
        vm.expectRevert("ID HKI tidak ditemukan");
        hki.getHKI(99);
    }
}
