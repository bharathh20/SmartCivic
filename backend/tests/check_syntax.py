# Syntax validator for app.js
with open('app.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

stack = []
for line_no, line in enumerate(lines, 1):
    for col_no, char in enumerate(line, 1):
        if char in '({[':
            stack.append((char, line_no, col_no))
        elif char in ')}]':
            if not stack:
                print(f"Extra closing '{char}' at line {line_no}:{col_no}")
            else:
                last_char, last_line, last_col = stack.pop()
                expected = {'(': ')', '{': '}', '[': ']'}[last_char]
                if char != expected:
                    print(f"Mismatched bracket: opened '{last_char}' at line {last_line}:{last_col}, closed with '{char}' at line {line_no}:{col_no}")

if stack:
    for char, l, c in stack:
        print(f"Unclosed '{char}' from line {l}:{c}")
else:
    print("ALL BRACKETS MATCHED PERFECTLY!")
