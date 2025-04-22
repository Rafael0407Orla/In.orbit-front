// import EmptyGoals from "./components/empty-goals";
import { Dialog } from "./components/ui/dialog";
import CreatGoal from "./components/create-goal";
import Summary from "./components/summary";
import { useEffect, useState } from "react";
import EmptyGoals from "./components/empty-goals";
import { useQuery } from "@tanstack/react-query";
import { getSummary } from "./http/get-summary";

type SummaryResponse = {
	completed: number;
	total: number;
	goalsPerDay: Record<
		string,
		{
			id: string;
			title: string;
			completedAt: string;
		}[]
	>;
};

export function App() {
	const { data } = useQuery({
		queryKey: ["summary"],
		queryFn: getSummary,
		staleTime: 60000,
	});

	return (
		<Dialog>
			{data?.total && data.total > 0 ? <Summary /> : <EmptyGoals />}
			{/* <Summary /> */}
			<CreatGoal />
		</Dialog>
	);
}
