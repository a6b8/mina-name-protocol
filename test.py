import base58

base58_string = "aaaa.test"

# Decode the Base58 string to bytes
decoded_bytes = base58.b58decode(base58_string)

# Check the length of the decoded bytes
current_length = len(decoded_bytes)

# Pad the bytes to 32 bytes if needed
if current_length < 32:
    padding_length = 32 - current_length
    padded_bytes = b'\x00' * padding_length + decoded_bytes
else:
    padded_bytes = decoded_bytes

# Now you have a 32-byte padded result
print(padded_bytes)

