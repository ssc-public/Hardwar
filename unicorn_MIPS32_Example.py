from __future__ import print_function
from unicorn import *
from unicorn.mips_const import *

# data in written in the data memory:
data = bytes([0x01,0x02,0x03,0x04,0x05,0x06,0x07,0x08,0x09,0x0A])

# memory address where data is written from
data_ADD = 0x2000

# code to be emulated (32-bit instruction word):
CODE =   bytes([0b_001000_00, 0b_000_00001, 0b_00000000, 0b_00001010,    # addi R1 = R0 + SE(10)
                0b_001000_00, 0b_000_00010, 0b_00000000, 0b_00000000,    # addi R2 = R0 + SE(0)

                0b_001000_00, 0b_001_00001, 0b_11111111, 0b_11111111,    # addi R1 = R1 + SE(-1)
                0b_100000_00, 0b_001_00011, 0b_00100000, 0b_00000000,    # lw R3, data_ADD(R1)
                0b_000000_00, 0b_010_00011, 0b_00010_000, 0b_00_100000,  # add R2 = R2 + R3
                0b_000111_00, 0b_001_00000, 0b_11111111, 0b_11111100,    # bgtz R1>0 , PC = PC - 4
                0b_000000_00, 0b_001_00000, 0b_00001_000, 0b_00_100000,  # add R1 = R1 + R0 (no operation)
                ])

# memory address where emulation starts
ADDRESS = 0x1000

print("Emulate MIPS code")
# Initialize emulator in MIPS-32bit mode
mu = Uc(UC_ARCH_MIPS, UC_MODE_MIPS32 + UC_MODE_BIG_ENDIAN)

# map 2MB memory for this emulation
mu.mem_map(ADDRESS, 2 * 1024 * 1024)

# write machine code to be emulated to memory
mu.mem_write(ADDRESS, CODE)

# initial the data-memory
mu.mem_write(data_ADD, data)


# initialize machine registers
mu.reg_write(UC_MIPS_REG_1, 0x0000)
mu.reg_write(UC_MIPS_REG_2, 0x0000)
mu.reg_write(UC_MIPS_REG_3, 0x0000)

# emulate code in infinite time & unlimited instructions
mu.emu_start(ADDRESS, ADDRESS + len(CODE))

# now print out some registers
print("Emulation done. Below is the CPU context")

reg_0 = mu.reg_read(UC_MIPS_REG_0)
reg_1 = mu.reg_read(UC_MIPS_REG_1)
reg_2 = mu.reg_read(UC_MIPS_REG_2)
reg_3 = mu.reg_read(UC_MIPS_REG_3)
reg_4 = mu.reg_read(UC_MIPS_REG_4)
reg_5 = mu.reg_read(UC_MIPS_REG_5)
reg_6 = mu.reg_read(UC_MIPS_REG_6)
reg_7 = mu.reg_read(UC_MIPS_REG_7)
print(">>> R0 = 0x%x" %reg_0)
print(">>> R1 = 0x%x" %reg_1)
print(">>> R2 = 0x%x" %reg_2)
print(">>> R3 = 0x%x" %reg_3)
print(">>> R4 = 0x%x" %reg_4)
print(">>> R5 = 0x%x" %reg_5)
print(">>> R6 = 0x%x" %reg_6)
print(">>> R7 = 0x%x" %reg_7)
print("Sum of 1 to 10 is:",reg_2)