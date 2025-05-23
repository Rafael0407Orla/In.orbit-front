import { CheckCircle2, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { DialogTrigger } from "./ui/dialog";
import InOrbitIcon from "./in-orbit-icon";
import { Progress, ProgressIndicator } from "./ui/progress-bar";
import { Separator } from "./ui/separator";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSummary } from "../http/get-summary";
import dayjs from "dayjs";
import ptBR from "dayjs/locale/pt-BR";
import PendingGoals from "./pending-goals";
import { deleteGoalCompletion } from "../http/delete-goal-completion";

dayjs.locale(ptBR);

function Summary() {
	const queryClient = useQueryClient();

	const { data } = useQuery({
		queryKey: ["summary"],
		queryFn: getSummary,
		staleTime: 1000 * 60,
	});
	if (!data) return null;
	const firstDayOfWeek = dayjs().startOf("week").format("D MMM");
	const lastDayOfWeek = dayjs().endOf("week").format("D MMM");
	const completedPorcentage = Math.round((data?.completed * 100) / data?.total);

	async function handleDeleteGoalCompletion(goalId: string) {
		await deleteGoalCompletion({ goalId });
		queryClient.invalidateQueries({ queryKey: ["summary"] });
		queryClient.invalidateQueries({ queryKey: ["pending-goals"] });
	}

	return (
		<div className="py-10 max-w-[480px] px-5 mx-auto flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<InOrbitIcon />
					<span className="text-lg font-semibold capitalize">
						{firstDayOfWeek} - {lastDayOfWeek}
					</span>
				</div>
				<DialogTrigger asChild>
					<Button size="sm">
						<Plus className="size-4" />
						Cadastrar Meta
					</Button>
				</DialogTrigger>
			</div>
			<div className=" flex flex-col gap-3">
				<Progress value={1} max={13}>
					<ProgressIndicator style={{ width: `${completedPorcentage}%` }} />
				</Progress>
				<div className="flex items-center justify-between text-xs text-zinc-400">
					<span>
						Você completou{" "}
						<span className="text-zinc-100">{data?.completed}</span> de{" "}
						<span className="text-zinc-100">{data?.total}</span> metas nessa
						semana.
					</span>
					<span>{completedPorcentage}%</span>
				</div>
			</div>
			<Separator />

			<PendingGoals />
			<h2 className="text-xl font-medium">Sua semana</h2>

			{Object.entries(data.goalsPerDay).map(([date, goals]) => {
				const weekDay = dayjs(date).format("dddd");
				const formattedDate = dayjs(date).format("D[ de ]MMMM");
				return (
					<div key={date} className="flex flex-col gap-6">
						<div className="flex flex-col gap-4">
							<h3 className="font-medium capitalize ">
								<span className="capitalize">{weekDay} </span>
								<span className="text-zinc-400 text-xs">({formattedDate})</span>
							</h3>

							<ul className="flex flex-col gap-5">
								{goals.map((goal) => {
									const time = dayjs(goal.completedAt).format("HH:mm");

									return (
										<li key={goal.id} className="flex items-center gap-4">
											<div className="flex flex-row gap-2 items-center mr-3">
												<CheckCircle2 className="size-4 text-pink-500" />
												<span className="text-sm text-zinc-400">
													Você completou "
													<span className="text-zinc-100 font-bold">
														{goal.title}
													</span>
													" às{" "}
													<span className="text-zinc-100 font-bold">
														{time}
													</span>
												</span>
											</div>
											<Button
												variant="text"
												onClick={() => handleDeleteGoalCompletion(goal.id)}
											>
												Desafazer
											</Button>
										</li>
									);
								})}
							</ul>
						</div>
					</div>
				);
			})}
		</div>
	);
}

export default Summary;
