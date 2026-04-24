import random

CHOICES = ["rock", "paper", "scissors"]
WINS = {
    "rock": "scissors",
    "paper": "rock",
    "scissors": "paper",
}

def get_result(player, computer):
    if player == computer:
        return "tie"
    return "win" if WINS[player] == computer else "lose"

def main():
    scores = {"win": 0, "lose": 0, "tie": 0}

    print("=== Rock Paper Scissors ===")
    print("Type 'rock', 'paper', or 'scissors' to play. Type 'quit' to exit.\n")

    while True:
        player = input("Your choice: ").strip().lower()

        if player == "quit":
            break
        if player not in CHOICES:
            print(f"Invalid choice. Pick from: {', '.join(CHOICES)}\n")
            continue

        computer = random.choice(CHOICES)
        result = get_result(player, computer)
        scores[result] += 1

        print(f"Computer chose: {computer}")
        print(f"Result: {result.upper()}\n")

    print(f"Final score — Wins: {scores['win']}  Losses: {scores['lose']}  Ties: {scores['tie']}")

if __name__ == "__main__":
    main()
