interface CreateGoalRequest {
  goalId: string;
}

export async function deleteGoalCompletion({ goalId }: CreateGoalRequest) {
  await fetch("http://localhost:3333/completions", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ goalId }),
  });
}
