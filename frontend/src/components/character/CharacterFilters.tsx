import { CLASSES, RACES } from '../../utils/constants'
import Input from '../common/Input'
import Select from '../common/Select'

interface CharacterFiltersProps {
    search: string
    classFilter: string
    raceFilter: string
    sort: string
    order: 'asc' | 'desc'
    onSearchChange: (value: string) => void
    onClassChange: (value: string) => void
    onRaceChange: (value: string) => void
    onSortChange: (value: string) => void
    onOrderChange: (value: 'asc' | 'desc') => void
}

export default function CharacterFilters({
    search,
    classFilter,
    raceFilter,
    sort,
    order,
    onSearchChange,
    onClassChange,
    onRaceChange,
    onSortChange,
    onOrderChange,
}: CharacterFiltersProps) {
    return (
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
                Filter Characters
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                {/* Search Input */}
                <div>
                    <Input
                        label="Search"
                        type="text"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search by name..."
                    />
                </div>

                {/* Class Filter */}
                <Select
                    label="Class"
                    value={classFilter}
                    onChange={(e) => onClassChange(e.target.value)}
                    options={CLASSES.map(cls => ({ value: cls, label: cls }))}
                    placeholder="All Classes"
                />

                {/* Race Filter */}
                <Select
                    label="Race"
                    value={raceFilter}
                    onChange={(e) => onRaceChange(e.target.value)}
                    options={RACES.map(race => ({ value: race, label: race }))}
                    placeholder="All Races"
                />

                {/* Sort By */}
                <Select
                    label="Sort By"
                    value={sort}
                    onChange={(e) => onSortChange(e.target.value)}
                    options={[
                        { value: 'characterName', label: 'Name' },
                        { value: 'class', label: 'Class' },
                        { value: 'race', label: 'Race' },
                        { value: 'level', label: 'Level' },
                        { value: 'updatedAt', label: 'Last Modified' },
                    ]}
                />

                {/* Sort Order */}
                <Select
                    label="Order"
                    value={order}
                    onChange={(e) => onOrderChange(e.target.value as 'asc' | 'desc')}
                    options={[
                        { value: 'asc', label: 'Ascending' },
                        { value: 'desc', label: 'Descending' },
                    ]}
                />
            </div>
        </div>
    )
}
