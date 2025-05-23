import { X } from "lucide-react";
import { Button } from "./ui/button";
import {
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
	RadioGroup,
	RadioGroupIndicator,
	RadioGroupItem,
} from "./ui/radio-group";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createGoal } from "../http/create-goal";
import { useQueryClient } from "@tanstack/react-query";

type CreateGoalFormType = z.infer<typeof createGoalForm>;

const createGoalForm = z.object({
	title: z.string().min(1, "Informe o nome da atividade"),
	desiredWeeklyFrequency: z.coerce.number().min(1).max(7),
});

function CreatGoal() {
	const queryClient = useQueryClient();

	const { register, control, handleSubmit, formState, reset } = useForm({
		resolver: zodResolver(createGoalForm),
	});

	async function handleCreateGoal(data: CreateGoalFormType) {
		await createGoal({
			title: data.title,
			desiredWeeklyFrequency: data.desiredWeeklyFrequency,
		});
		queryClient.invalidateQueries({ queryKey: ["summary"] });
		queryClient.invalidateQueries({ queryKey: ["pending-goals"] });
		reset();
	}
	return (
		<DialogContent>
			<div className="flex flex-col gap-6 h-full">
				<div className="flex flex-col gap-3">
					<div className="flex items-center justify-between">
						<DialogTitle>Cadastrar nova meta</DialogTitle>
						<DialogClose>
							<X className="size-5 text-zinc-600" />
						</DialogClose>
					</div>
					<DialogDescription>
						Adicione atividades que te fazem bem e que você quer continuar
						praticando toda semana.
					</DialogDescription>
				</div>
				<form
					className="flex-1 flex flex-col justify-between"
					onSubmit={handleSubmit(handleCreateGoal)}
				>
					<div className="flex flex-col gap-6">
						<div className="flex flex-col gap-2">
							<Label htmlFor="title">Qual a atividade?</Label>
							<Input
								placeholder="Praticar exercicios"
								autoFocus
								id="title"
								{...register("title")}
							/>
							{formState.errors.title && (
								<p className="text-red-400 text-sm">
									{formState.errors.title.message}
								</p>
							)}
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="title">Quantas vezes na semana?</Label>
							<Controller
								control={control}
								name="desiredWeeklyFrequency"
								defaultValue={3}
								render={({ field }) => (
									<RadioGroup
										onValueChange={field.onChange}
										value={String(field.value)}
									>
										<RadioGroupItem value="1">
											<RadioGroupIndicator />
											<span className="text-zinc-300 text-sm font-medium leading-none">
												1x vez na semana
											</span>
											<span className="text-lg leading-none">🥱</span>
										</RadioGroupItem>
										<RadioGroupItem value="2">
											<RadioGroupIndicator />
											<span className="text-zinc-300 text-sm font-medium leading-none">
												2x vez na semana
											</span>
											<span className="text-lg leading-none">🙂</span>
										</RadioGroupItem>
										<RadioGroupItem value="3">
											<RadioGroupIndicator />
											<span className="text-zinc-300 text-sm font-medium leading-none">
												3x vez na semana
											</span>
											<span className="text-lg leading-none">😎</span>
										</RadioGroupItem>
										<RadioGroupItem value="4">
											<RadioGroupIndicator />
											<span className="text-zinc-300 text-sm font-medium leading-none">
												4x vez na semana
											</span>
											<span className="text-lg leading-none">😜</span>
										</RadioGroupItem>
										<RadioGroupItem value="5">
											<RadioGroupIndicator />
											<span className="text-zinc-300 text-sm font-medium leading-none">
												5x vez na semana
											</span>
											<span className="text-lg leading-none">🤨</span>
										</RadioGroupItem>
										<RadioGroupItem value="6">
											<RadioGroupIndicator />
											<span className="text-zinc-300 text-sm font-medium leading-none">
												6x vez na semana
											</span>
											<span className="text-lg leading-none">🤯</span>
										</RadioGroupItem>
										<RadioGroupItem value="7">
											<RadioGroupIndicator />
											<span className="text-zinc-300 text-sm font-medium leading-none">
												Todos dias da semana
											</span>
											<span className="text-lg leading-none">🔥</span>
										</RadioGroupItem>
									</RadioGroup>
								)}
							/>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<DialogClose asChild>
							<Button type="button" className="flex-1" variant="secondary">
								Fechar
							</Button>
						</DialogClose>
						<Button className="flex-1">Salvar</Button>
					</div>
				</form>
			</div>
		</DialogContent>
	);
}

export default CreatGoal;
