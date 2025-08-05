"""
functions.py

Module where helper function(s) reside.

"""


def capitalize(sentence: str) -> str:
    """Capitalize sentence, return sentence."""
    return " ".join([word.capitalize() for word in sentence.split()])
