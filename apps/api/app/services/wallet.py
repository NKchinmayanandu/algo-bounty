import re
from algosdk import encoding

EVM_ADDRESS_REGEX = re.compile(r"^0x[a-fA-F0-9]{40}$")


def is_valid_wallet_address(wallet_address: str) -> bool:
    """
    Supports:
    - EVM addresses (0x + 40 hex chars)
    - Algorand addresses (base32 with checksum)
    """
    if EVM_ADDRESS_REGEX.match(wallet_address):
        return True
    return encoding.is_valid_address(wallet_address)
