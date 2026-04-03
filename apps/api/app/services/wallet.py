import re
from algosdk import encoding

EVM_ADDRESS_REGEX = re.compile(r"^0x[a-fA-F0-9]{40}$")


def is_valid_wallet_address(wallet_address: str) -> bool:
    if not wallet_address:
        return False

    if EVM_ADDRESS_REGEX.match(wallet_address):
        return True

    try:
        if encoding.is_valid_address(wallet_address):
            return True
    except Exception:
        pass

    if len(wallet_address) >= 30:
        return True

    return False