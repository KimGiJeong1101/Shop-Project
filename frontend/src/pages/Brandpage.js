import BasicLayout from "../layouts/BasicLayout";
import { ArrowPathIcon, GlobeAsiaAustraliaIcon, CheckBadgeIcon } from '@heroicons/react/20/solid'

const BrandPage = () => {

    const features = [
        { name: 'VEGAN & Cruelty-free', description: '미국 PETA(People for the Ethical Treatment of Animals)를 통해 크루얼티프리 앤 비건(Cruelty-free & Vegan) 인증을 받았습니다. 써니콘의 모든 제품은 동물성 원료를 일체 사용하지 않으며, 제조 과정에서 동물실험을 하지 않습니다.' },
        { name: 'UGLY FOOD', description: '우리는 환경과 생물학적 다양성을 존중하며 지역 사회의 경제 발전 창출에 기여, 자연의 낭비를 줄이고자 합니다. 청정지에서 수확됐지만 정형화되지 않은 모양으로 시장에 납품하지 못해 버려진 농산물,어글리 푸드를 사용합니다.' },
        { name: '업사이클링 패키지', description: '단순히 재활용 패키지만을 고집하는 것이 아닌 용기 배출 이후의 상황까지 고려하여 디자인하였습니다. 용기 과잉 생산되고 무심히 버려지는 플라스틱(PCR*)과 파유리를 재가공한 리사이클 용기를 사용합니다.' },
        { name: '전제품 재활용 등급 우수', description: '환경부 재활용 평가 등급 우수 제품으로 환경 친화적인 리사이클 패키지의 취지 강화와 환경적 악영향을 최소화하기 위해 재활용이 용이하도록 디자인되었습니다' },
    ]

    return (
        <BasicLayout>
            <div className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0">
                <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
                    <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
                        <div className="lg:pr-4">
                            <div className="lg:max-w-lg">
                                <p className="text-base font-semibold leading-7 text-orange-400">BelleAnge</p>
                                <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">벨앙주, 천사의 손길이 닿는 향기로운 세상으로!</h1>
                                <p className="mt-6 text-xl leading-8 text-gray-700">
                                    우리는 미래를 향한 열정으로 시작한 벨앙주입니다. 저희는 화장품의 미학과 기능을 결합하여 새로운 아름다움을 제안하는 것을 사명으로 삼고 있습니다. 우리의 이름은 프랑스어로 '천사'를 뜻하는 말로, 마치 천사의 손길이 닿은 듯한 아름다움을 추구합니다.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="-ml-12 -mt-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
                        <img
                            className="w-[48rem] max-w-none rounded-xl bg-gray-900 shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem]"
                            src="../img/about/beach.jpg"
                            alt=""
                        />
                    </div>
                    <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
                        <div className="lg:pr-4">
                            <div className="max-w-xl text-base leading-7 text-gray-700 lg:max-w-lg">
                                <p>
                                    벨앙주는 신선한 바람을 불러오는 신생 브랜드로, 자연의 힘을 극대화하여 만든 비건 화장품을 선보입니다. 우리는 화장품을 통해 아름다움을 창조함과 동시에 지구 환경을 보호하는 것을 목표로 삼고 있습니다. 친환경적이고 지속 가능한 제품을 만들어 소비자들에게 더 나은 선택을 제공하고자 노력합니다.
                                </p>
                                <ul role="list" className="mt-8 space-y-8 text-gray-600">
                                    <li className="flex gap-x-3">
                                        <ArrowPathIcon className="mt-1 h-5 w-5 flex-none text-orange-400" aria-hidden="true"></ArrowPathIcon>
                                        <span>
                                            <strong className="font-semibold text-gray-900">업사이클링 패키지</strong>
                                            단순히 재활용 패키지만을 고집하는 것이 아닌 용기 배출 이후의 상황까지 고려한 디자인
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3">
                                        <GlobeAsiaAustraliaIcon className="mt-1 h-5 w-5 flex-none text-orange-400" aria-hidden="true"></GlobeAsiaAustraliaIcon>
                                        <span>
                                            <strong className="font-semibold text-gray-900">VEGAN & Cruelty-free</strong>
                                            미국 PETA(People for the Ethical Treatment of Animals)를 통해 크루얼티프리 앤 비건(Cruelty-free & Vegan) 인증
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3">
                                        <CheckBadgeIcon className="mt-1 h-5 w-5 flex-none text-orange-400" aria-hidden="true"></CheckBadgeIcon>
                                        <span>
                                            <strong className="font-semibold text-gray-900">UGLY FOOD</strong>
                                            어글리 푸드를 사용해 지역 사회의 경제 발전 창출에 기여
                                        </span>
                                    </li>
                                </ul>
                                <p className="mt-8">
                                    우리의 제품은 풍부한 영양성분으로 피부를 건강하고 아름답게 가꾸어 줍니다. 기초 화장품을 주력으로, 피부에 자연의 건강한 빛을 불어넣는 제품들을 선보이고 있습니다. 우리의 화장품은 동물실험을 하지 않으며, 동식물 기반 성분으로 만들어져 자연과 환경을 존중하는 브랜드의 정신을 반영합니다.
                                </p>
                                <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">환경을 위한 작은 날갯짓에 동참해 주세요.</h2>
                                <p className="mt-6">
                                    우리는 당신의 아름다움을 존중하고, 지속 가능한 미래를 꿈꾸며 노력합니다. 벨앙주와 함께라면 자연과 조화롭게 빛나는 아름다움을 찾을 수 있습니다. 함께해요, 우리의 아름다운 여정에!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white">
                <div className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-8 gap-y-16 px-4 py-24 sm:px-6 sm:py-32 lg:max-w-7xl lg:grid-cols-2 lg:px-8">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Blue wave’s POWER</h2>
                        <p className="mt-4 text-gray-500">
                            넓고 깊은 바다에서 아무리 헤엄쳐도 큰 파도가 일지 않지만,그 반동으로 물속에서 헤엄칠 수 있듯 우리의 작은 헤엄침이 모이면 언젠가 세상에 큰 파도가 될 것이라 생각합니다.
                            아직 개척되지 않은 무한한 생명과 가능성이 있는 드넓고 깊은 푸른 바다를 위해 더 나은 Blue wave에 대한 무한한 확장성과 가능성으로 아름다운 바다, 지구를 보호하고 희망적이고 밝은 내일을 위해 우리는 오늘도 긍정의 파란 물결을 헤엄칩니다.
                        </p>

                        <dl className="mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:gap-x-8">
                            {features.map((feature) => (
                                <div key={feature.name} className="border-t border-gray-200 pt-4">
                                    <dt className="font-medium text-gray-900">{feature.name}</dt>
                                    <dd className="mt-2 text-sm text-gray-500">{feature.description}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                    <div className="grid grid-cols-2 grid-rows-2 gap-4 sm:gap-6 lg:gap-8">
                        <img
                            src="../img/about/about1.jpg"
                            alt="ABOUT1"
                            className="rounded-lg bg-gray-100"
                        />
                        <img
                            src="../img/about/about2.jpg"
                            alt="ABOUT2"
                            className="rounded-lg bg-gray-100"
                        />
                        <img
                            src="../img/about/about3.jpg"
                            alt="ABOUT3"
                            className="rounded-lg bg-gray-100"
                        />
                        <img
                            src="../img/about/about4.jpg"
                            alt="ABOUT4"
                            className="rounded-lg bg-gray-100"
                        />
                    </div>
                </div>
            </div>

        </BasicLayout>
    );
}

export default BrandPage;